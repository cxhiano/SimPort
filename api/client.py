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
