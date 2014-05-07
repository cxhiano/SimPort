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
        self.get_params()

    def __getattr__(self, attr):
        return partial(self.client.__getattr__(attr),
                       dr=self.dr, dc=self.dc)

    def get_params(self):
        self.rows = self.client.getParam('port.depot.rows')
        self.columns = self.client.getParam('port.depot.columns')

    def random(self, start_cnt=0):
        max_stack = self.client.getParam('port.maxStacks')
        cnt = start_cnt
        self.data = []
        for i in range(self.rows):
            row = []
            for j in range(self.columns):
                boxes = []
                for k in range(random.randrange(max_stack)):
                    boxes.append(cnt)
                    cnt += 1
                row.append(boxes)
            self.data.append(row)
        self.setBoxes(data=self.data)
        return cnt
