import tornado.httpclient as http
import json

def send_instr(instr):
    print instr
    req = http.HTTPRequest(
        'http://localhost:8888/instr/new',
        method='POST',
        body=json.dumps(instr)
        )
    try:
        print client.fetch(req).body
    except http.HTTPError as ex:
        print ex

if __name__ == '__main__':
    client = http.HTTPClient()
    instr = {
        'instr': 'addBox',
        'dr': 0,
        'dc': 0,
        }
    cnt = 0
    for dx in range(2):
        for dy in range(2):
            instr['dr'] = dx
            instr['dc'] = dy
            for x in range(5):
                for y in range(5):
                    instr['row'] = x
                    instr['column'] = y
                    instr['box'] = str(cnt)
                    print instr
                    cnt += 1
                    send_instr(instr)
    for x in range(2):
        for y in range(2):
            instr = {
                'instr': 'pickup',
                'dr': x,
                'dc': y,
                'lift': 'l'
            }
            send_instr(instr)
            instr = {
                'instr': 'hMove',
                'dr': x,
                'dc': y,
                'lift': 'l',
                'column': 4,
            }
            send_instr(instr)
            instr = {
                'instr': 'vMove',
                'dr': x,
                'dc': y,
                'lift': 'l',
                'row': 4,
            }
            send_instr(instr)
            instr = {
                'instr': 'putdown',
                'dr': x,
                'dc': y,
                'lift': 'l'
            }
            send_instr(instr)
            instr = {
                'instr': 'vMove',
                'dr': x,
                'dc': y,
                'lift': 'l',
                'row': 0,
            }
            send_instr(instr)
    client.close()
