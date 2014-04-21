import client
import logging
from functools import partial

class Lift(object):
    def __init__(self, dr, dc, lift, client):
        self.dr = dr
        self.dc = dc
        self.lift = lift
        self.client = client

    def __getattr__(self, attr):
        return partial(self.client.__getattr__(attr),
                       dr=self.dr, dc=self.dc, lift=self.lift)

    def getRunStatus(self, token):
        return self.null(token=token)
