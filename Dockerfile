# syntax = edrevo/dockerfile-plus
# Dockerfile for development environment
FROM litespeedtech/openlitespeed:1.7.18-lsphp81

INCLUDE+ Dockerfile.common
INCLUDE+ Dockerfile.entrypoint
