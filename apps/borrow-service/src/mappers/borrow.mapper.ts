import { createClassTransformerMapper } from "../core/base.mapper";
import { BorrowDto } from "../dtos/borrow.dto";
import { Borrow } from "../models/borrow.model";

export const BorrowMapper = createClassTransformerMapper<Borrow, BorrowDto>(BorrowDto);