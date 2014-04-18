import tornado.httpclient as http
import json

def send_instr(instr):
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
        'dr': 1,
        'dc': 3,
        'row': 0,
        'column': 0,
        }
    send_instr(instr)
    '''
    for x in [4, 1, 3, 2]:
        instr['column'] = x
        for y in range(5):
            instr['dr'] = y
            for z in range(5):
                instr['dc'] = z
                send_instr(instr)
    '''
    client.close()
