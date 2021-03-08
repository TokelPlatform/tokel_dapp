import json
import sys


def main():
    if not sys.argv[3]:
        raise Exception("Missing parameters")
    else:
        coin = sys.argv[1]
        wif = sys.argv[2]
        addr = sys.argv[3]
        txt = {
              "chain": coin,
              "wif": wif,
              "address": addr
        }
        with open("test_setup.txt", "w") as ts:
            json.dump(txt, ts)


if __name__ == '__main__':
    main()
