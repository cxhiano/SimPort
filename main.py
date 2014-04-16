'''
Server
'''

import os.path
import logging
import tornado.ioloop
import tornado.web
from tornado.web import RequestHandler

class MainHandler(RequestHandler):
    '''
    Display home page
    '''
    def get(self):
        return self.render('display.html', title='Sim Port')

class InstructionDispatcher(object):
    '''
    Send instruction from server to browser
    '''
    def __init__(self):
        self.callback = None
        self.cache = []

    def do_callback(self):
        '''
        using callback to send isntruction
        '''
        if self.callback:
            try:
                ret = self.cache[0]
                self.callback(ret)
                self.cache.remove(ret)
                self.callback = None
            except:
                logging.error('Error in waiter callback', exc_info=True)

    def new(self, instr):
        '''
        create a new instruction to be sent to browser
        '''
        self.cache.append(instr)
        self.do_callback()

    def register(self, callback):
        '''
        register a callback which will be used to send instruction to browser
        '''
        self.callback = callback
        if len(self.cache) > 0:
            self.do_callback()

dispatcher = InstructionDispatcher()

class InstructionUpdateHandler(RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        dispatcher.register(self._on_new_instruction)

    def _on_new_instruction(self, instr):
        '''
        callback used to send instruction to browser,
        end asynchronous http request and return instr
        '''
        if self.request.connection.stream.closed():
            return
        self.finish(instr)

class NewInstructionHandler(RequestHandler):
    '''
    receive instruction from http request and send it to browser
    '''
    def post(self):
        dispatcher.new(self.request.body)
        self.finish()

def main():
    '''
    setup server
    '''
    app = tornado.web.Application(
            [
                (r'/', MainHandler),
                (r'/instr/get', InstructionUpdateHandler),
                (r'/instr/new', NewInstructionHandler),
                ],
            template_path=os.path.join(os.path.dirname(__file__), 'templates'),
            static_path=os.path.join(os.path.dirname(__file__), 'static'),
            )
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__': 
    main()
