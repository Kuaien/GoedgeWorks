# -*- coding: utf-8 -*-
#
#   GoEdge脚本【网站批量绑定SSL证书】
#   https://github.com/Kuaien/Goedge-Admin-Theme
#
#   GoEdge模版、插件、脚本定制请联系TG: https://t.me/kuaien66
#
from datetime import datetime
import requests
import base64
import json

# API节点地址
WebApiUrl = 'http://10.211.55.9:53981'
# AccessKey ID
AccessID = 'k1ySpOeOAcQV8vNG'
# AccessKey密钥
AccessKey = 'q573ukqK0BPLY1SJjo58PQG00KFNg2HY'
# 平台用户ID（创建网站和申请证书的时候一定要选择平台用户）
userId = 1


# 获取操作Token
token = ''
if not token:
    post_data = {"type": "admin", "accessKeyId": AccessID, "accessKey": AccessKey}
    response = requests.post('{}/APIAccessTokenService/getAPIAccessToken'.format(WebApiUrl), data=json.dumps(post_data))
    r = response.json()
    token = r['data']['token']
    print(token)
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'X-Edge-Access-Token': token
}

# 查找一个用户下的所有网站
def findAllUserServers():
    r = requests.post('{}/ServerService/findAllUserServers'.format(WebApiUrl), data=json.dumps({"userId": userId}), headers=headers)
    data = r.json()
    if data['code'] == 200:
        servers = data['data']['servers']
        print("用户网站数量: {}\n---------------".format(len(servers)))
        return servers
    else:
        print('Token已过期，请重新登录')
        return []

# 查找网站配置
def findEnabledServerConfig(serverId):
    data = {"serverId": serverId}
    r = requests.post('{}/ServerService/findEnabledServerConfig'.format(WebApiUrl), data=json.dumps(data), headers=headers)
    data = r.json()
    data_base = data['data']['serverJSON']
    data_encode = base64.b64decode(data_base).decode('utf-8')
    data_json = json.loads(data_encode)
    site_data = {
        "id": data_json['id'],
        "type": data_json['type'],
        "name": data_json['name'],
        "serverNames": data_json['serverNames'],
        "isOn": True,
        "listen": [{'protocol': 'https', 'host': '', 'portRange': '443'}],
        "sslPolicy": None
    }
    if data_json['https'] and data_json['https']['sslPolicy']:
        site_data['isOn'] = data_json['https']['isOn']
        site_data['listen'] = data_json['https']['listen']
        site_data['sslPolicy'] = data_json['https']['sslPolicy']['certs']
    return site_data

# 列出单页匹配的证书
def listSSLCerts(domains):
    data = {"domains": domains, "isAvailable": True, "userId": userId, "offset": 0, "size": 1}
    r = requests.post('{}/SSLCertService/listSSLCerts'.format(WebApiUrl), data=json.dumps(data), headers=headers)
    data = r.json()
    data_base = data['data']['sslCertsJSON']
    data_encode = base64.b64decode(data_base).decode('utf-8')
    data_json = json.loads(data_encode)
    ssl_data = False
    if len(data_json) > 0:
        ssl_data = data_json[0]
    return ssl_data

# 创建SSL创建策略
def createSSLPolicy(certId):
    data = {
        "http2Enabled": True,
        "minVersion": "TLS 1.1",
        "sslCertsJSON": base64.b64encode(json.dumps([{"isOn": True,"certId": certId}]).encode('utf-8')).decode('utf-8')
    }
    r = requests.post('{}/SSLPolicyService/createSSLPolicy'.format(WebApiUrl), data=json.dumps(data), headers=headers)
    data = r.json()
    sslPolicyId = None
    if data['code'] == 200:
        sslPolicyId = data['data']['sslPolicyId']
    return sslPolicyId

# 修改网站的HTTPS设置
def updateServerHTTPS(site):
    http_json = {
        "isOn": site['isOn'],
        "listen": site['listen'],
        "sslPolicyRef": site['sslPolicyRef']
    }
    data = {
        "serverId": site['id'],
        "httpsJSON": base64.b64encode(json.dumps(http_json).encode('utf-8')).decode('utf-8')
    }
    r = requests.post('{}/ServerService/updateServerHTTPS'.format(WebApiUrl), data=json.dumps(data), headers=headers)
    data = r.json()
    if data['code'] == 200:
        print("--SSL证书绑定成功！")
    else:
        print("--SSL证书绑定失败: {}".format(data['message']))


user_sites = findAllUserServers()
for site in user_sites:
    # 查找网站配置
    site_config = findEnabledServerConfig(site['id'])
    if not site_config['sslPolicy']:
        print("{} 未绑定SSL证书，正在查询可绑定证书...".format(site_config['name']))
        domains = [site_config['serverNames'][0]['name']]
        if site_config['serverNames'][0]['subNames']:
            domains = site_config['serverNames'][0]['subNames']

        # 列出单页匹配的证书
        ssl_config = listSSLCerts(domains)
        if ssl_config:
            print("--已查询到SSL证书，正在绑定中...")
            sslPolicyId = createSSLPolicy(ssl_config['id'])
            if sslPolicyId:
                site_config['sslPolicyRef'] = {'isOn': True, 'sslPolicyId': sslPolicyId}
                updateServerHTTPS(site_config)
            else:
                print('--生成SSL策略失败，请重试')
        else:
            print("--未查询到相关SSL证书！")
    else:
        print("{} 已绑定SSL证书！".format(site_config['name']))
        print("--证书申请时间: {}".format(datetime.fromtimestamp(site_config['sslPolicy'][0]['timeBeginAt']).strftime('%Y-%m-%d %H:%M')))
        print("--证书到期时间: {}".format(datetime.fromtimestamp(site_config['sslPolicy'][0]['timeEndAt']).strftime('%Y-%m-%d %H:%M')))
        
    print('-------------------')
