import client
import logging

class Lift(object):
    def __init__(self, dr, dc, lift, client):
        self.instr = {
            'dr': dr,
            'dc': dc,
            'lift': lift,
        }
        self.client = client

    def _exc_instr(self, args):
        ret = self.instr.copy()
        ret.update(args)
        return self.client.send(ret)

    def move_to(self, r, c):
        if c != None:
            self._exc_instr({
                'instr': 'hMove',
                'column': c,
                })

        if r != None:
            self._exc_instr({
                'instr': 'vMove',
                'row': r,
                })

    def pickup(self):
        self._exc_instr({
            'instr': 'pickup',
            })

    def putdown(self):
        self._exc_instr({
            'instr': 'putdown',
            })
