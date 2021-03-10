#!/usr/bin/env python3
# Copyright (c) 2019 SuperNET developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

from test_framework.nspvlib import NspvRpcCalls as NRC
import pytest
import time
import json
import os

"""
   Simple unittest based ob pytest framework for libnspv
   Make sure you have installed framework: pip3 install pytest
   Set wif to spend form and address to spend to as json in test_setup.txt file
   Default coin is ILN
   You can add any new coins to test, please set coin_params dict entry
   To run tests do: "python3 -m pytest test_nspv.py -s" from rpctest directory
"""


def setup_module():
    global addr_send, wif_real, coin, call, chain_params

    #f = open("test_setup.txt", "r")
    #test_setup = json.load(f)
    #f.close()

    # wif_real = test_setup.get("wif")
    wif_real = os.environ.get('WALL')
    addr_send = os.environ.get('ADDRESS')
    coin = os.environ.get('CHAIN')

    if not addr_send or not wif_real:
        pytest.exit("Please check test wif and address variables availability")

    chain_params = {"KMD": {
                            'tx_list_address': 'RGShWG446Pv24CKzzxjA23obrzYwNbs1kA',
                            'min_chain_height': 1468080,
                            'notarization_height': '1468000',
                            'prev_notarization_h': 1467980,
                            'next_notarization_h': 1468020,
                            'hdrs_proof_low': '1468100',
                            'hdrs_proof_high': '1468200',
                            'numhdrs_expected': 151,
                            'tx_proof_id': 'f7beb36a65bc5bcbc9c8f398345aab7948160493955eb4a1f05da08c4ac3784f',
                            'tx_spent_height': 1456212,
                            'tx_proof_height': '1468520',
                            'port': '7771',
                           },
                    "ILN": {
                            'tx_list_address': 'RUp3xudmdTtxvaRnt3oq78FJBjotXy55uu',
                            'min_chain_height': 3689,
                            'notarization_height': '2000',
                            'prev_notarization_h': 1998,
                            'next_notarization_h': 2008,
                            'hdrs_proof_low': '2000',
                            'hdrs_proof_high': '2100',
                            'numhdrs_expected': 113,
                            'tx_proof_id': '67ffe0eaecd6081de04675c492a59090b573ee78955c4e8a85b8ac0be0e8e418',
                            'tx_spent_height': 2681,
                            'tx_proof_height': '2690',
                            'port': '12986',
                           },
                    "HUSH": {
                             'tx_list_address': 'RCNp322uAXmNo37ipQAEjcGQgBXY9EW9yv',
                             'min_chain_height': 69951,
                             'notarization_height': '69900',
                             'prev_notarization_h': 69800,
                             'next_notarization_h': 69700,
                             'hdrs_proof_low': '66100',
                             'hdrs_proof_high': '66200',
                             'numhdrs_expected': 123,
                             'tx_proof_id': '661bae364443948a009fa7f706c3c8b7d3fa6b0b27eca185b075abbe85bbdedc',
                             'tx_spent_height': 2681,
                             'tx_proof_height': '2690',
                             'port': '18031'
                            }
                    }
    userpass = "userpass"
    url = "http://127.0.0.1:" + chain_params.get(coin).get("port")
    call = NRC(url, userpass)
    call.nspv_logout()


def test_help_call():
    """ Response should contain "result": "success"
        Response should contain actual help data"""
    print('\n', "testing help call")
    rpc_call = call.nspv_help()
    if not rpc_call:
        pytest.exit("Can't connect daemon")
    call.assert_success(rpc_call)
    call.assert_contains(rpc_call, "methods")


def test_getpeerinfo_call():
    """Response should not be empty, at least one node should be in sync"""
    print('\n', "testing peerinfo call, checking peers status")
    rpc_call = call.type_convert(call.nspv_getpeerinfo())
    if not rpc_call[0]:
        raise Exception("Empty response :", rpc_call)
    call.assert_contains(rpc_call[0], "ipaddress")


def test_check_balance():
    """Check if wif given has actual balance to perform further tests"""
    print('\n', "Checking wif balance")
    call.nspv_login(wif_real)
    res = call.type_convert(call.nspv_listunspent())
    amount = res.get("balance")
    if amount > 0.1:
        pass
    else:
        pytest.exit("Not enough balance, please use another wif")


def test_getinfo_call():
    """ Response should contain "result": "success"
        Response should contain actual data"""
    print('\n', "testing getinfo call")
    rpc_call = call.nspv_getinfo()
    call.assert_success(rpc_call)
    call.assert_contains(rpc_call, "notarization")
    call.assert_contains(rpc_call, "header")


def test_hdrsproof_call():
    """ Response should be successful for case 2 and fail for others
        Response should contain actual headers"""
    print('\n', "testing hdrsproof call")
    prevheight = [False, chain_params.get(coin).get("hdrs_proof_low")]
    nextheight = [False, chain_params.get(coin).get("hdrs_proof_high")]

    # Case 1 - False data
    rpc_call = call.nspv_hdrsproof(prevheight[0], nextheight[0])
    call.assert_error(rpc_call)

    # Case 2 - known data
    rpc_call = call.nspv_hdrsproof(prevheight[1], nextheight[1])
    call.assert_success(rpc_call)
    call.assert_contains(rpc_call, "prevht")
    call.assert_contains(rpc_call, "nextht")
    call.assert_contains(rpc_call, "headers")
    rep = call.type_convert(rpc_call)
    hdrs_resp = rep.get('numhdrs')
    call.assert_equal(hdrs_resp, chain_params.get(coin).get("numhdrs_expected"))


def test_notarization_call():
    """ Response should be successful for case 2
     Successful response should contain prev and next notarizations data"""
    print('\n', "testing notarization call")
    height = [False, chain_params.get(coin).get("notarization_height")]

    # Case 1 - False data
    rpc_call = call.nspv_notarizations(height[0])
    call.assert_error(rpc_call)

    # Case 2 - known data
    rpc_call = call.nspv_notarizations(height[1])
    call.assert_success(rpc_call)
    call.assert_contains(rpc_call, "prev")
    call.assert_contains(rpc_call, "next")


def getnewaddress_call():
    """ Get a new address, save it for latter calls"""
    print('\n', "testing getnewaddr call")
    rpc_call = call.nspv_getnewaddress()
    call.assert_contains(rpc_call, "wifprefix")
    call.assert_contains(rpc_call, "wif")
    call.assert_contains(rpc_call, "address")
    call.assert_contains(rpc_call, "pubkey")


def test_login_call():
    """"login with fresh credentials
        Response should contain address, address should be equal to generated earlier one"""
    print('\n', "testing log in call")
    global logged_address
    rpc_call = call.nspv_getnewaddress()
    rep = call.type_convert(rpc_call)
    wif = rep.get('wif')
    addr = rep.get('address')
    rpc_call = call.nspv_login(wif)
    call.assert_success(rpc_call)
    call.assert_contains(rpc_call, "status")
    call.assert_contains(rpc_call, "address")
    rep = call.type_convert(rpc_call)
    logged_address = rep.get('address')
    if logged_address != addr:
        raise AssertionError("addr missmatch: ", addr, logged_address)


def test_listtransactions_call():
    """"Successful response should [not] contain txids and same address as requested
        Case 1 - False data, user is logged in - should not print txids for new address"""
    print('\n', "testing listtransactions call")
    call.nspv_logout()
    real_addr = chain_params.get(coin).get("tx_list_address")

    # Case 1 - False Data
    rpc_call = call.nspv_listtransactions(False, False, False)
    call.assert_success(rpc_call)
    call.assert_not_contains(rpc_call, "txids")
    rep = call.type_convert(rpc_call)
    addr_response = rep.get('address')
    if addr_response != logged_address:
        raise AssertionError("addr missmatch: ", addr_response, logged_address)

    # Case 2 - known data
    rpc_call = call.nspv_listtransactions(real_addr, 0, 1)
    call.assert_success(rpc_call)
    call.assert_contains(rpc_call, "txids")
    rep = call.type_convert(rpc_call)
    addr_response = rep.get('address')
    if addr_response != real_addr:
        raise AssertionError("addr missmatch: ", addr_response, real_addr)

    # Case 3 - known data, isCC = 1
    rpc_call = call.nspv_listtransactions(real_addr, 1, 1)
    call.assert_success(rpc_call)
    call.assert_not_contains(rpc_call, "txids")
    rep = call.type_convert(rpc_call)
    addr_response = rep.get('address')
    if addr_response != real_addr:
        raise AssertionError("addr missmatch: ", addr_response, real_addr)


def test_litunspent_call():
    """ Successful response should [not] contain utxos and same address as requested"""
    print('\n', "testing listunspent call")
    call.nspv_logout()
    real_addr = chain_params.get(coin).get("tx_list_address")

    # Case 1 - False dataf
    rpc_call = call.nspv_listunspent(False, False, False)
    call.assert_success(rpc_call)
    call.assert_not_contains(rpc_call, "utxos")
    rep = call.type_convert(rpc_call)
    addr_response = rep.get('address')
    if addr_response != logged_address:
        raise AssertionError("addr missmatch: ", addr_response, logged_address)

    # Case 2 - known data
    rpc_call = call.nspv_listunspent(real_addr, 0, 0)
    call.assert_success(rpc_call)
    call.assert_contains(rpc_call, "utxos")
    rep = call.type_convert(rpc_call)
    addr_response = rep.get('address')
    if addr_response != real_addr:
        raise AssertionError("addr missmatch: ", addr_response, real_addr)

    # Case 3 - known data, isCC = 1, should not return utxos
    rpc_call = call.nspv_listunspent(real_addr, 1, 0)
    call.assert_success(rpc_call)
    call.assert_not_contains(rpc_call, "utxos")
    rep = call.type_convert(rpc_call)
    addr_response = rep.get('address')
    if addr_response != real_addr:
        raise AssertionError("addr missmatch: ", addr_response, real_addr)


def test_spend_call():
    """Successful response should contain tx and transaction hex"""
    print('\n', "testing spend call")
    amount = [False, 0.1]
    address = [False, addr_send]

    # Case 1 - false data
    rpc_call = call.nspv_spend(address[0], amount[0])
    call.assert_error(rpc_call)
    rpc_call = call.nspv_spend(address[1], amount[0])
    call.assert_error(rpc_call)

    # Case 2 - known data, no legged in user
    rpc_call = call.nspv_spend(address[1], amount[1])
    call.assert_error(rpc_call)

    # Case 3 - login with wif, create a valid transaction
    call.nspv_logout()
    call.nspv_login(wif_real)
    rpc_call = call.nspv_spend(address[1], amount[1])
    call.assert_success(rpc_call)
    call.assert_contains(rpc_call, "tx")
    call.assert_contains(rpc_call, "hex")


def test_broadcast_call():
    """Successful broadcasst should have equal hex broadcasted and expected"""
    print('\n', "testing broadcast call")
    call.nspv_logout()
    call.nspv_login(wif_real)
    rpc_call = call.nspv_spend(addr_send, 0.1)
    rep = call.type_convert(rpc_call)
    hex_res = rep.get("hex")
    hex = [False, "norealhexhere", hex_res]
    retcode_failed = [-1, -2, -3]

    # Cae 1 - No hex given
    rpc_call = call.nspv_broadcast(hex[0])
    call.assert_error(rpc_call)

    # Case 2 - Non-valid hex, failed broadcast should contain appropriate retcode
    rpc_call = call.nspv_broadcast(hex[1])
    call.assert_in(rpc_call, "retcode", retcode_failed)

    # Case 3 - Hex of previous transaction
    rpc_call = call.nspv_broadcast(hex[2])
    call.assert_success(rpc_call)
    rep = call.type_convert(rpc_call)
    broadcast_res = rep.get("broadcast")
    expected = rep.get("expected")
    if broadcast_res == expected:
        pass
    else:
        raise AssertionError("Aseert equal braodcast: ", broadcast_res, expected)


def test_mempool_call():
    """ Response should contain txids"""
    print('\n', "testing mempool call")
    rpc_call = call.nspv_mempool()
    call.assert_success(rpc_call)
    # call.assert_contains(rpc_call, "txids") - mempool() response not always contains "txids" key, even on success


def test_spentinfo_call():
    """Successful response sould contain same txid and same vout"""
    print('\n', "testing spentinfo call")
    r_txids = [False, chain_params.get(coin).get("tx_proof_id")]
    r_vouts = [False, 1]

    # Case 1 - False data
    rpc_call = call.nspv_spentinfo(r_txids[0], r_vouts[0])
    call.assert_error(rpc_call)

    # Case 2 - known data
    rpc_call = call.nspv_spentinfo(r_txids[1], r_vouts[1])
    call.assert_success(rpc_call)
    rep = call.type_convert(rpc_call)
    txid_resp = rep.get("txid")
    if r_txids[1] != txid_resp:
        raise AssertionError("Unexpected txid: ", r_txids[1], txid_resp)
    vout_resp = rep.get("vout")
    if r_vouts[1] != vout_resp:
        raise AssertionError("Unxepected vout: ", r_vouts[1], vout_resp)


def test_faucetinfo():
    """Not implemented call yet"""
    return True


def test_gettransaction():
    """Not implemented yet"""
    print('\n', "testing gettransaction call")
    rpc_call = call.nspv_gettransaction()
    call.assert_error(rpc_call)


def test_autologout():
    """Wif should expeire in 777 seconds"""
    print('\n', "testing auto logout")
    rpc_call = call.nspv_getnewaddress()
    rep = call.type_convert(rpc_call)
    wif = rep.get('wif')
    rpc_call = call.nspv_login(wif)
    call.assert_success(rpc_call)
    time.sleep(778)
    rpc_call = call.nspv_spend(addr_send, 0.1)
    call.assert_error(rpc_call)


def test_stop():
    """Send funds to reset utxo amount in wallet
       Stop nspv process after tests"""
    print('\n', "Resending funds")
    maxfee = 0.01
    call.nspv_login(wif_real)
    res = call.type_convert(call.nspv_listunspent())
    amount = res.get("balance") - maxfee
    res = call.type_convert(call.nspv_spend(addr_send, amount))
    hexs = res.get("hex")
    call.nspv_broadcast(hexs)
    print('\n', "stopping nspv process")
    rpc_call = call.nspv_stop()
    call.assert_success(rpc_call)
    print('\n', "all tests are finished")
