import { Cat } from './interfaces/cat.interface';
export declare class MonitsService {
    private readonly cats;
    create(cat: Cat): void;
    findAll(): Cat[];
}
