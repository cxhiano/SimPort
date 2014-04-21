import tornado.httpclient as http
import logging
import json
from functools import partial

class Client(http.HTTPClient):
    def send(self, **kwargs):
        req = http.HTTPRequest(
            'http://localhost:8888/instr/new',
            method='POST',
            body=json.dumps(kwargs)
            )
        try:
            ret = self.fetch(req).body
            logging.debug(ret)
            return json.loads(ret)
        except http.HTTPError as ex:
            logging.error(ex)

    def __getattr__(self, attr):
        return partial(self.send, instr=attr)
