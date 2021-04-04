#!/usr/bin/env python3
# Copyright (c) 2019 SuperNET developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

import sys
import json
from requests import get

"""
   Travis helper to fetch and write test_params.txt
   Specify as command line params: url, user, password
   AE: python3 travis.py http://mysecure.domain/secure/file username userpassword
"""


def main():
    if not sys.argv[3]:
        raise Exception("Missing parameters")
    else:
        url = sys.argv[1]
        user = sys.argv[2]
        pwd = sys.argv[3]
    r = get(url, auth=(user, pwd))
    f = open("test_setup.txt", "w")
    print(r)  # debug
    json.dump(r.json(), f)
    f.close()


if __name__ == "__main__":
    main()
