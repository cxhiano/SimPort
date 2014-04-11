import os.path
import logging
import tornado.ioloop
import tornado.web
from tornado.web import RequestHandler

class MainHandler(RequestHandler):
    def get(self):
        return self.render('display.html', title = 'Sim Port')

class InstructionDispatcher():
    def __init__(self):
        self.callback = None
        self.cache = []

    def do_callback(self):
        if self.callback:
            try:
                ret = self.cache[0]
                self.callback(ret)
                self.cache.remove(ret)
                self.callback = None
            except:
                logging.error('Error in waiter callback', exc_info = True)

    def new(self, instr):
        self.cache.append(instr)
        self.do_callback()

    def register(self, callback):
        self.callback = callback
        if len(self.cache) > 0:
            self.do_callback()

    def deregister(self):
        self.callback = None

dispatcher = InstructionDispatcher()

class InstructionUpdateHandler(RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        dispatcher.register(self.on_new_instruction)

    def on_new_instruction(self, instr):
        if self.request.connection.stream.closed():
            return
        self.finish(instr)

    def on_connection_close(self):
        dispatcher.deregister()

class NewInstructionHandler(RequestHandler):
    def post(self):
        dispatcher.new(self.request.body)
        self.finish()

def main():
    app = tornado.web.Application(
            [
                (r'/', MainHandler),
                (r'/instr/get', InstructionUpdateHandler),
                (r'/instr/new', NewInstructionHandler),
                ],
            template_path = os.path.join(os.path.dirname(__file__), 'templates'),
            static_path = os.path.join(os.path.dirname(__file__), 'static'),
            )
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    main()
