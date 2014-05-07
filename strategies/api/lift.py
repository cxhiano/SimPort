import client
import logging
from functools import partial

class Lift(object):
    def __init__(self, dr, dc, lift, client):
        self.dr = dr
        self.dc = dc
        self.lift = lift
        self.client = client
        self.get_params()

    def __getattr__(self, attr):
        return partial(self.client.__getattr__(attr),
                       dr=self.dr, dc=self.dc, lift=self.lift)

    def get_params(self):
        self.h_vel = self.client.getParam('Lift.params.hVelocity')
        self.v_vel = self.client.getParam('Lift.params.vVelocity')
        self.t_pick = self.client.getParam('Lift.params.tPickup')
        self.t_put = self.client.getParam('Lift.params.tPutdown')

    def move_box(self, src_r, src_c, dst_r, dst_c):
        self.hMove(column=src_c)
        self.vMove(row=src_r)
        self.pickup()
        self.vMove(row=dst_r)
        self.hMove(column=dst_c)
        self.putdown()

