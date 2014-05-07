import httplib
import logging
import json
from functools import partial

class Client(httplib.HTTPConnection):
    def send_instr(self, **kwargs):
        self.request('POST', '/instr/new', json.dumps(kwargs))
        if kwargs['ret']:
            return json.load(self.getresponse())
        else:
            self.close()
            self.connect()

    def __getattr__(self, attr, ret=False):
        return partial(self.send_instr, instr=attr, ret=ret)

    def getParam(self, param):
        return self.send_instr(instr='getParam', param=param, ret=True)['value']
