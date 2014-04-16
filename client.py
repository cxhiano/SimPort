import tornado.httpclient as http

def send_instr(instr):
    req = http.HTTPRequest(
        'http://localhost:8888/instr/new',
        method='POST',
        body=str(instr),
        )
    try:
        client.fetch(req)
    except http.HTTPError as ex:
        print ex

if __name__ == '__main__':
    client = http.HTTPClient()
    instr = {
        'instr': 'hMove',
        'dr': 0,
        'dc': 0,
        'lift': 'r',
        'column': 4,
        }
    for x in [4, 1, 3, 2]:
        instr['column'] = x
        for y in range(5):
            instr['dr'] = y
            for z in range(5):
                instr['dc'] = z
                send_instr(instr)
    client.close()
