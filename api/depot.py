import lift

class Depot(object):
    def __init__(self, dr, dc, client):
        self.instr = {
            'dr': dr,
            'dc': dc,
            }
        self.client = client
        self.lifts = {
            'l': lift.Lift(dr, dc, 'l', client),
            'r': lift.Lift(dr, dc, 'r', client),
            }

    def _exc_instr(self, args):
        ret = self.instr.copy()
        ret.update(args)
        return self.client.send(ret)

    def set_boxes(self, data):
        self._exc_instr({
            'instr': 'setDepotBoxes',
            'data': data,
            });

    def get_boxes(self, r, c):
        return self._exc_instr({
            'instr': 'getBoxes',
            'row': r,
            'column': c,
            })

    def move_box(self, lift, src_r, src_c, dst_r, dst_c):
        l = self.lifts[lift]
        l.move_to(src_r, src_c)
        l.pickup()
        l.move_to(dst_r, dst_c)
        l.putdown()
