# Project Explanation

## Objective
To demonstrate concurrent transactions in a hospital appointment system and explain how locking and serializability prevent two patients from receiving the same doctor appointment slot.

## Problem
Patient A and Patient B may request the same doctor and time at almost the same moment. If both transactions read AVAILABLE before either update is protected, both can attempt to book the slot.

## Transactions
T1 = Patient A booking.
T2 = Patient B booking.

Operations:
READ → CHECK → WRITE → COMMIT

## Conflicting operations
Both transactions access the same appointment record. The important conflict is WRITE(T1) versus WRITE(T2). Read/write ordering can also produce an incorrect schedule.

## Solution
Use an exclusive lock on the appointment record. T1 obtains the lock, checks availability, writes the booking and commits. T2 waits. After T1 releases the lock, T2 reads BOOKED and rolls back/rejects the booking.

## Serializability
The controlled execution is equivalent to the serial schedule T1 → T2. Its precedence graph has an edge T1 → T2 and no cycle, so the schedule is conflict-serializable.

## ACID
Atomicity: booking succeeds fully or rolls back.
Consistency: one slot cannot be assigned twice.
Isolation: conflicting transactions do not interfere.
Durability: a committed transaction remains stored in a real DBMS.

## Viva
Q: Why can double booking occur?
A: Both transactions can read AVAILABLE before either update is protected.

Q: Why use locking?
A: To prevent another transaction from changing the same appointment record while it is being updated.

Q: What is serializability?
A: A concurrent schedule is correct when its result is equivalent to a serial execution.

Q: What happens to T2?
A: It waits for the lock and then sees the slot as BOOKED, so it is rejected/rolled back.
