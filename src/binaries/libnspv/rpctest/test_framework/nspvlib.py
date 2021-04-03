#!/usr/bin/env python3
# Copyright (c) 2019 SuperNET developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

import requests
import json
import ast
import time
import os.path
import sys
sys.path.append(os.path.join(os.path.dirname(__file__)))


class NspvRpcCalls:

    def __init__(self, node_ip="", user_pass=""):
        self.node_ip = node_ip
        self.user_pass = user_pass

    @ staticmethod
    def assert_equal(first, second):
        if first != second:
            raise AssertionError(first, "not equal to", second)

    def assert_success(self, result):
        result_d = self.type_convert(result)
        self.assert_equal(result_d.get('result'), 'success')

    def assert_in(self, result, key, compare_list):
        result_d = self.type_convert(result)
        content = result_d.get(key)
        if content in compare_list:
            pass
        else:
            raise AssertionError("Error:", content, "not in", compare_list)

    def assert_contains(self, result, key):
        """assert key contains expected data"""
        if type(result) == bytes:
            result = self.type_convert(result)
        content = result.get(key)
        if content:
            pass
        else:
            raise AssertionError("Unexpected response, missing param: ", key)

    def assert_not_contains(self, result, key):
        """assert key contains expected data"""
        result_d = self.type_convert(result)
        content = result_d.get(key)
        if not content:
            pass
        else:
            raise AssertionError("Unexpected response, missing param: ", key)

    def assert_error(self, result):
        """ assert there is an error with known error message """
        error_msg = ['no height', 'invalid height range', 'invalid method', 'timeout', 'error', 'no hex',
                     'couldnt get addressutxos', 'invalid address or amount too small', 'not enough funds',
                     'invalid address or amount too small', 'invalid utxo', 'wif expired', 'not implemented yet',
                     'invalid utxo']
        result_d = self.type_convert(result)
        error = result_d.get('error')
        if error:
            if error in error_msg:
                pass
            else:
                raise AssertionError("Unknown error message")
        else:
            raise AssertionError("Unexpected response")

    @ staticmethod
    def type_convert(bytez):
        """Wraps nspv_call response"""
        # r = json.loads(bytes.decode("utf-8"))
        r = ast.literal_eval(bytez.decode("utf-8"))
        time.sleep(1)
        return r

    def nspv_broadcast(self, rawhex):
        params = {'userpass': self.user_pass,
                  'method': 'broadcast'}
        if rawhex:
            params.update({'hex': rawhex})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_getinfo(self, height=False):
        params = {'userpass': self.user_pass,
                  'method': 'getinfo'}
        if height:
            params.update({'height':height})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_getnewaddress(self):
        params = {'userpass': self.user_pass,
                  'method': 'getnewaddress'}
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_getpeerinfo(self):
        params = {'userpass': self.user_pass,
                  'method': 'getpeerinfo'}
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_hdrsproof(self, prevheight, nextheight):
        params = {'userpass': self.user_pass,
                  'method': 'hdrsproof'}
        if prevheight:
            params.update({'prevheight':prevheight})
        if nextheight:
            params.update({'nextheight':nextheight})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_help(self):
        params = {'userpass': self.user_pass,
                  'method': 'help'}
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_listtransactions(self, address=False, isCC=False, skipcount=False, txfilter=False):
        params = {'userpass': self.user_pass,
                  'method': 'listtransactions'}
        if address:
            params.update({'address': address})
        if isCC:
            params.update({'isCC': isCC})
        if skipcount:
            params.update({'skipcount': skipcount})
        if txfilter:
            params.update({'filter': txfilter})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_listunspent(self, address=False, isCC=False, skipcount=False, txfilter=False):
        params = {'userpass': self.user_pass,
                  'method': 'listunspent'}
        if address:
            params.update({'address': address})
        if isCC:
            params.update({'isCC': isCC})
        if skipcount:
            params.update({'skipcount': skipcount})
        if txfilter:
            params.update({'filter': txfilter})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_login(self, wif=False):
        params = {'userpass': self.user_pass,
                  'method': 'login'}
        if wif:
            params.update({'wif': wif})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_logout(self):
        params = {'userpass': self.user_pass,
                  'method': 'logout'}
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_mempool(self):
        params = {'userpass': self.user_pass,
                  'method': 'mempool'}
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_notarizations(self, height):
        params = {'userpass': self.user_pass,
                  'method': 'notarizations'}
        if height:
            params.update({'height': height})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_spend(self, address, amount):
        params = {'userpass': self.user_pass,
                  'method': 'spend'}
        if address:
            params.update({'address': address})
        if amount:
            params.update({'amount': amount})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_spentinfo(self, txid, vout):
        params = {'userpass': self.user_pass,
                  'method': 'spentinfo'}
        if txid:
            params.update({'txid': txid})
        if vout:
            params.update({'vout': vout})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_stop(self):
        params = {'userpass': self.user_pass,
                  'method': 'stop'}
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_txproof(self, txid, height):
        params = {'userpass': self.user_pass,
                  'method': 'txproof'}
        if txid:
            params.update({'txid': txid})
        if height:
            params.update({'height': height})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_faucetget(self):
        params = {'userpass': self.user_pass,
                  'method': 'faucetget'}
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content

    def nspv_gettransaction(self, hash="", vout="", height=""):
        params = {'userpass': self.user_pass,
                  'method': 'gettransaction'}
        if hash:
            params.update({'hash': hash})
        if vout:
            params.update({'vout': vout})
        if height:
            params.update({'height': height})
        r = requests.post(self.node_ip, json=params)
        time.sleep(1)
        return r.content
