import client
import logging
from functools import partial

class Crane(object):
    def __init__(self, dr, dc, crane, client):
        self.dr = dr
        self.dc = dc
        self.crane = crane
        self.client = client
        self.get_params()

    def __getattr__(self, attr):
        return partial(self.client.__getattr__(attr),
                       dr=self.dr, dc=self.dc, crane=self.crane)

    def get_params(self):
        self.h_vel = self.client.getParam('Crane.params.hVelocity')
        self.v_vel = self.client.getParam('Crane.params.vVelocity')
        self.t_pick = self.client.getParam('Crane.params.tPickup')
        self.t_put = self.client.getParam('Crane.params.tPutdown')

    def move_box(self, src_r, src_c, dst_r, dst_c):
        self.hMove(column=src_c)
        self.vMove(row=src_r)
        self.pickup()
        self.vMove(row=dst_r)
        self.hMove(column=dst_c)
        self.putdown()

