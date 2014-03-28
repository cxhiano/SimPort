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

    def _dequeue(self):
        ret = self.cache[0]
        self.cache.remove(ret)
        return ret

    def new(self, instr):
        self.cache.append(instr)
        if self.callback:
            try:
                self.callback(self._dequeue())
            except:
                logging.error('Error in waiter callback', exc_info = True)
            self.waiters = None

    def register(self, callback):
        if len(self.cache) > 0:
            callback(self._dequeue())
        else:
            self.callback = callback

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
        self.finish(dict(instr = instr))

    def on_connection_close(self):
        dispatcher.deregister()

class NewInstructionHandler(RequestHandler):
    def get(self, instr):
        dispatcher.new(instr)

def main():
    app = tornado.web.Application(
            [
                (r'/', MainHandler),
                (r'/instr/get', InstructionUpdateHandler),
                (r'/instr/new/(.*)', NewInstructionHandler),
                ],
            template_path = os.path.join(os.path.dirname(__file__), 'templates'),
            static_path = os.path.join(os.path.dirname(__file__), 'static'),
            )
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    main()
