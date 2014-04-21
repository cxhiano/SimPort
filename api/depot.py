import lift
from functools import partial

class Depot(object):
    def __init__(self, dr, dc, client):
        self.dr = dr
        self.dc = dc
        self.client = client
        self.lifts = {
            'l': lift.Lift(dr, dc, 'l', client),
            'r': lift.Lift(dr, dc, 'r', client),
            }

    def __getattr__(self, attr):
        return partial(self.client.__getattr__(attr),
                       dr=self.dr, dc=self.dc)

    def move_box(self, lift, src_r, src_c, dst_r, dst_c):
        l = self.lifts[lift]
        l.hMove(column=src_c)
        l.vMove(row=src_r)
        l.pickup()
        l.vMove(row=dst_r)
        l.hMove(column=dst_c)
        l.putdown()
