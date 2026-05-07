# Security Specification: CodeMaster AI

## Data Invariants
1. A user can only read their own progress and write their own progress data.
2. Global tracks and lessons are read-only for students; only admins (if any) can write to them.
3. A progress entry must reference a valid userId (matching the authenticated user).
4. Scores must be non-negative.
5. User profile data (like averageGrade) can only be updated if the user completes a new lesson (validated track progress).

## The Dirty Dozen Payloads (Red Team Audit)
1. **Identity Theft**: User A tries to read User B's progress. (Expected: DENIED)
2. **Score Spicing**: User A tries to write a score of 1,000,000 for an easy lesson. (Expected: DENIED if score > lesson.maxPoints)
3. **Ghost Modules**: Trying to write a progress entry for a lesson that doesn't exist. (Expected: DENIED)
4. **Vandalism**: Student tries to delete a track or lesson content. (Expected: DENIED)
5. **Session Hijacking**: Writing to `users/{uid}` where `uid` is not the requester's. (Expected: DENIED)
6. **Shadow Fields**: Adding `isAdmin: true` to a user profile update. (Expected: DENIED)
7. **Negative Progress**: Attempting to set `completed: false` after it was already completed. (Expected: DENIED)
8. **Malformed IDs**: Using a 1MB string as a lesson ID. (Expected: DENIED)
9. **PII Leak**: Reading a user's private email from the `users` collection if they aren't the owner. (Expected: DENIED)
10. **Time Warp**: Setting `updatedAt` to a future date manually. (Expected: DENIED)
11. **Mass Extraction**: Querying all progress records across all users. (Expected: DENIED)
12. **Grade Injection**: Direct update of `averageGrade` without completing a lesson. (Expected: DENIED)

## Test Suite
(Testing logic will be implemented in firestore.rules)
