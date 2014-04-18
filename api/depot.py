import client
import logging

class Depot(object):
    def __init__(self, row, column, client):
        self.instr = {
            'dr': row,
            'dc': column,
        }
        self.client = client

    def _exc_instr(self, args):
        ret = self.instr.copy()
        ret.update(args)
        return self.client.send(ret)

    def move_lift_to(self, lift, r, c, src = None):
        if src == None:
            src = self._exc_instr({
                'instr': 'getPosition',
                'lift': lift,
                })['result']

        if src['column'] != c:
            self._exc_instr({
                    'instr': 'hMove',
                    'lift': lift,
                    'column': c,
                })

        if src['row'] != r:
            self._exc_instr({
                    'instr': 'vMove',
                    'lift': lift,
                    'row': r,
                })

    def move_box(self, lift, src_r, src_c, dst_r, dst_c):
        self.move_lift_to(lift, src_r, src_c)

        self._exc_instr({
            'instr': 'pickup',
            'lift': lift,
            })
        
        self.move_lift_to(lift, dst_r, dst_c, src={'row': src_r, 'column': src_c})

        self._exc_instr({
            'instr': 'putdown',
            'lift': lift,
            })

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    client = client.Client()
    d = Depot(0, 0, client)
    d.move_box('r', 1, 1, 3, 3)