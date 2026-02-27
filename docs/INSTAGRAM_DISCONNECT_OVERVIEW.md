# Instagram Disconnect Functionality Overview

This document provides a comprehensive overview of the Instagram account disconnection feature, including its architecture, user flow, and implementation details.

## 1. Overview

The disconnect functionality allows users to remove their Instagram account connection from the application. When a user disconnects their Instagram account:

- The Instagram account record is deleted from the database
- All associated automations are automatically removed (via database cascade)
- Local cached data (posts) is cleared
- The user is redirected to the connection screen

## 2. Architecture

### Frontend Components

#### ConnectionStatusHeader Component

**Location**: `src/components/dash/connection-status-header.tsx`

The disconnect button is integrated into the connection status header, displayed alongside the "Fetch Posts" button when an Instagram account is connected.

**Props**:

- `onDisconnect: () => void` - Callback function triggered when disconnect button is clicked
- `isDisconnecting: boolean` - Loading state indicator

**UI Features**:

- Displays an "Unlink" icon with "Disconnect" label
- Uses destructive styling (red border/text) to indicate the action's significance
- Shows loading spinner and "Disconnecting..." text during the operation
- Disabled state during fetch operations to prevent conflicts

#### Dashboard Page

**Location**: `src/app/dash/page.tsx`

The dashboard page orchestrates the disconnect flow:

1. Uses `useApi` hook to manage the disconnect API call
2. Implements `handleDisconnectInstagram` function that:
   - Shows confirmation dialog
   - Calls the disconnect API endpoint
   - Clears local storage (cached posts)
   - Resets component state (posts, automations)
   - Refreshes connection status
   - Shows success/error toast notifications

### Backend API

#### Disconnect Endpoint

**Route**: `POST /api/instagram/oauth/disconnect`
**Location**: `src/app/api/instagram/oauth/disconnect/route.ts`

**Flow**:

1. Authenticates the user via Clerk
2. Validates user is logged in (returns 401 if not)
3. Calls `disconnectAccount` service function
4. Returns success response with message

**Error Handling**:

- Returns 401 if user is not authenticated
- Returns 500 with error message if disconnection fails
- Catches and formats service layer errors

### Service Layer

#### Disconnect Service

**Location**: `src/server/services/oauth.service.ts`
**Function**: `disconnectAccount(clerkId: string)`

**Implementation**:

1. Finds user with Instagram account using `findUserWithInstaAccount`
2. Validates user and account exist
3. Deletes the Instagram account record via `deleteInstaAccount`
4. Database cascade automatically removes:
   - All automations associated with the account
   - All automation executions
   - All related data

**Error Handling**:

- Throws error if user or Instagram account not found
- Database operations are handled by repository layer with proper error handling

## 3. User Flow

1. **User Action**: User clicks "Disconnect" button in the connection status header
2. **Confirmation**: System shows confirmation dialog warning about automation removal
3. **API Call**: Frontend sends POST request to `/api/instagram/oauth/disconnect`
4. **Backend Processing**:
   - Validates authentication
   - Deletes Instagram account record
   - Cascade deletes all automations
5. **Frontend Cleanup**:
   - Clears localStorage (cached posts)
   - Resets posts and automations state
   - Refreshes connection status
6. **UI Update**: Dashboard shows connection screen (user can reconnect)

## 4. Data Cleanup

When disconnecting, the following data is removed:

### Database Records (Automatic via Cascade)

- `InstaAccount` record
- All `Automation` records for the account
- All `AutomationExecution` records

### Frontend State (Manual Cleanup)

- Cached posts in localStorage (`instagram_posts`)
- Component state for posts and automations

## 5. Security Considerations

- **Authentication Required**: Only authenticated users can disconnect their own account
- **User Validation**: Service layer validates user exists before deletion
- **Cascade Safety**: Database relationships ensure data integrity during deletion
- **No Orphaned Data**: Cascade deletes prevent orphaned automation records

## 6. Error Scenarios

1. **User Not Authenticated**: Returns 401, user must log in
2. **Account Not Found**: Service throws error, API returns 500
3. **Network Failure**: Frontend shows error toast, user can retry
4. **Partial Failure**: Database transaction ensures atomicity

## 7. Code Modularity

The implementation follows modular design principles:

- **Component Separation**: Disconnect button is part of `ConnectionStatusHeader` component
- **Hook Reusability**: Uses shared `useApi` hook for API calls
- **Service Layer**: Business logic separated in `oauth.service.ts`
- **Repository Pattern**: Database operations abstracted in repository layer
- **Type Safety**: Uses TypeScript types from `@dm-broo/common-types`

## 8. Future Enhancements

Potential improvements:

- Soft delete option (mark as inactive instead of hard delete)
- Export automations before deletion
- Reconnection flow that restores previous automations
- Audit log for disconnect events
- Batch disconnect for multiple accounts (if multi-account support added)
