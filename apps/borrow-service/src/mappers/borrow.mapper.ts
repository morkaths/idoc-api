import { createClassTransformerMapper } from "@libs/core";
import { BorrowDto } from "../dtos/borrow.dto";
import { Borrow } from "../models/borrow.model";

export const BorrowMapper = createClassTransformerMapper<Borrow, BorrowDto>(BorrowDto);