# Apache Qpidd Management Framework 2 for Node/Typescript
This library is a Typescript re-implementation of the same library originally written by [M. Broadstone](https://github.com/mbroadst/node-qmf2), with the now apparantly unmaintained [amqp10](https://github.com/noodlefrenzy/node-amqp10) library replaced with [rhea](https://github.com/amqp/rhea).

The difference is that in the original the class defs were generated, and I have written them in TS-proper, so you have autocomplete and type-safety.

This library will gradually improve with more consistent formatting and tests, and can be used to manage a single Qpid broker, or a pool of them.

## IMPORTANT! Upgrading from 2.x to 3.x+
I have now replaced the amqp10 library with the "official" rhea library. As the amqp10 project states that it is no longer maintained in favor of rhea.
This library has been ported, mainly because I need it to support Node 10.x+, and the amqp10 library seems to break om those versions. If you need to use this library on thos Node versions; you'll have to upgrade to 3.x of this library too.

## Testing with Qpidd cpp broker
This project includes a vagrant file which you can start to start testing this project. It will automatically download the source of all required projects and build them accordingly.
Once it has done so the first time, you can issue the following command to start an Qpid instance in a suitable/easy dev mode.

```bash
qpidd -dp0 --ha-queue-replication=yes --auth=no --protocols=amqp1.0 --data-dir `mktemp -d`
```

Testing is done with Jasmine. They can be run on unix-like systems (for now) with `npm test`.

### Helpfull resources
*Quickstart guide for Qpidd*
https://github.com/radeksm/qpid-quick-start

*Introduction to AMQP 1.0*
http://www.slideshare.net/ClemensVasters/amqp-10-introduction
https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_MRG/3/pdf/Messaging_Programming_Reference/Red_Hat_Enterprise_MRG-3-Messaging_Programming_Reference-en-US.pdf

*How to create and configure queues using qpid-config*
https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_MRG/2/html/Messaging_Installation_and_Configuration_Guide/Create_and_Configure_Queues_using_qpid_config.html

*How to do request response with AMQP1.0*
https://msdn.microsoft.com/en-us/library/mt727956.aspx

*QMF Protocol*
https://cwiki.apache.org/confluence/display/qpid/QMF+Protocol
