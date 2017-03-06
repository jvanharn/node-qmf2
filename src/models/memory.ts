import {QMFObject} from '../class';

export class Memory extends QMFObject {
    public className = 'Memory';
    public properties = [
        { name: 'name', type: 'sstr', access: 'RC', index: 'y' },
        { name: 'malloc_arena',  type: 'uint64',  access: 'RO',  optional: 'y' },
        { name: 'malloc_ordblks',  type: 'uint64',  access: 'RO',  optional: 'y' },
        { name: 'malloc_hblks',  type: 'uint64',  access: 'RO',  optional: 'y' },
        { name: 'malloc_hblkhd',  type: 'uint64',  access: 'RO',  optional: 'y' },
        { name: 'malloc_uordblks',  type: 'uint64',  access: 'RO',  optional: 'y' },
        { name: 'malloc_fordblks',  type: 'uint64',  access: 'RO',  optional: 'y' },
        { name: 'malloc_keepcost',  type: 'uint64',  access: 'RO',  optional: 'y' }
    ];
}
