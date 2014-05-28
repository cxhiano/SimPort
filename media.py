import logging
import json

def _simple_token_generator():
    i = 0
    while True:
        yield i
        i += 1

class Media(object):
    '''
    Serve as the media between browser and server
    '''
    def __init__(self, token_generator=_simple_token_generator()):
        self.update_callback = None
        self.fb_callback = {}
        self.instr_cache = []
        self.token_generator = token_generator

    def new(self, instr, callback):
        '''
        create a new instruction to be sent to browser and return its token
        '''
        logging.debug('new instruction:' + instr)
        instr = json.loads(instr)
        if not instr.has_key('token'):
            token = self.token_generator.next()
            instr['token'] = token
        else:
            token = instr['token']
        self.fb_callback[token] = callback
        self.instr_cache.append(json.dumps(instr))
        self._do_update_callback()
        return token

    def deregister_feedback(self, token):
        if self.fb_callback.has_key(token):
            logging.debug('Feedback deregistered: {0}'.format(token))
            del self.fb_callback[token]

    def register_updater(self, callback):
        '''
        register a callback which will be used to send instruction to browser
        '''
        self.update_callback = callback
        self._do_update_callback()

    def feedback(self, data):
        logging.debug('Response: {0}'.format(data))
        try:
            for item in json.loads(data):
                token = item.get('token')
                if token != None:
                    callback = self.fb_callback.get(token)
                    if callback:
                        del self.fb_callback[token]
                        callback(item)
                    else:
                        logging.debug('No corresponding callback: {0}'.format(item))
        except ValueError:
            logging.error('Error loading response: {0}'.format(data))

    def _do_update_callback(self):
        if len(self.instr_cache) == 0:
            return
        if self.update_callback:
            try:
                self.update_callback(json.dumps(self.instr_cache))
                self.instr_cache = []
                self.update_callback = None
            except:
                logging.error('Error in waiter callback', exc_info=True)
