# Apache Qpidd Management Framework 2 for Node/Typescript
This library is a typescript implementation of the same library originally written by [M. Broadstone](https://github.com/mbroadst/node-qmf2).
The difference is that in the original the class defs were generated, and I have written them in TS-proper, so you have autocomplete and type-safety.
This library will gradually improve with more consistent formatting and tests, and can be used to manage a single Qpid broker, or a pool of them.

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