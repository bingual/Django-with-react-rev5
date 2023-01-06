from .common import *

INSTALLED_APPS += [
    "debug_toolbar",
]

MIDDLEWARE = [

                 "debug_toolbar.middleware.DebugToolbarMiddleware",
             ] + MIDDLEWARE

INTERNAL_IPS = [
    "127.0.0.1",
]

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

CORS_ORIGIN_WHITELIST = ["http://127.0.0.1:3000", "http://localhost:3000"]
