import tornado.httpclient as http
import logging
import json

class Client(http.HTTPClient):
    def send(self, instr):
        logging.debug(instr)
        req = http.HTTPRequest(
            'http://localhost:8888/instr/new',
            method='POST',
            body=json.dumps(instr)
            )
        try:
            ret = self.fetch(req).body
            logging.debug(ret)
            return json.loads(ret)
        except http.HTTPError as ex:
            logging.error(ex)

def test():
    client = Client()
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
                    cnt += 1
                    client.send(instr)
    for x in range(2):
        for y in range(2):
            instr = {
                'instr': 'pickup',
                'dr': x,
                'dc': y,
                'lift': 'l'
            }
            client.send(instr)
            instr = {
                'instr': 'hMove',
                'dr': x,
                'dc': y,
                'lift': 'l',
                'column': 4,
            }
            client.send(instr)
            instr = {
                'instr': 'vMove',
                'dr': x,
                'dc': y,
                'lift': 'l',
                'row': 4,
            }
            client.send(instr)
            instr = {
                'instr': 'putdown',
                'dr': x,
                'dc': y,
                'lift': 'l'
            }
            client.send(instr)
            instr = {
                'instr': 'vMove',
                'dr': x,
                'dc': y,
                'lift': 'l',
                'row': 0,
            }
            client.send(instr)
    client.close()

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    client = Client()
    instr = {
        'instr': 'putdown',
        'dr': 0,
        'dc': 0,
        'lift': 't'
    }
    client.send(instr)
