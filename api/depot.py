import lift
import random
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
        self.data = []

    def __getattr__(self, attr):
        return partial(self.client.__getattr__(attr),
                       dr=self.dr, dc=self.dc)

    def get_size(self):
        rows = self.client.getParam('port.depot.rows')
        columns = self.client.getParam('port.depot.columns')
        return rows, columns

    def move_box(self, lift, src_r, src_c, dst_r, dst_c):
        l = self.lifts[lift]
        l.hMove(column=src_c)
        l.vMove(row=src_r)
        l.pickup()
        l.vMove(row=dst_r)
        l.hMove(column=dst_c)
        l.putdown()

    def random(self, start_cnt=0):
        rows, columns = self.get_size()
        max_stack = self.client.getParam('port.maxStacks')
        cnt = start_cnt
        self.data = []
        for i in range(rows):
            row = []
            for j in range(columns):
                boxes = []
                for k in range(random.randrange(max_stack)):
                    boxes.append(cnt)
                    cnt += 1
                row.append(boxes)
            self.data.append(row)
        self.setBoxes(data=self.data)
