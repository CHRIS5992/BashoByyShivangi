# Workshops Feature - API Documentation

## Overview
The Workshops module provides a complete system for managing pottery workshops, experiences, and registrations. It includes support for different workshop types, slot management, and participant registration.

## Workshop Types
- **Group Workshop**: Regular group pottery classes
- **One-on-One Workshop**: Private sessions with personalized instruction
- **Couple Pottery Date**: Romantic pottery experiences for couples
- **Birthday Celebration**: Birthday party packages with pottery
- **Farm & Garden Mini Party**: Studio experiences in the garden setting

## API Endpoints

### 1. Workshops API

#### List All Workshops
```
GET /api/workshops/
```
Lists all available workshops with filtering and search capabilities. Returns paginated results with workshop details including pricing, duration, and availability.

**Parameters:**
- `workshop_type` (optional): Filter by type (group, one-on-one, couple, birthday, party)
- `difficulty_level` (optional): Filter by difficulty (beginner, intermediate, advanced, all)
- `is_featured` (optional): Filter featured workshops (true/false)
- `is_popular` (optional): Filter popular workshops (true/false)
- `search` (optional): Search in name, description
- `ordering` (optional): Sort by price, duration_hours, created_at, name

#### Get Single Workshop
```
GET /api/workshops/{id}/
```
Retrieves detailed information for a specific workshop including all available slots and registration details.

#### Get Workshop Slots
```
GET /api/workshops/{id}/slots/
```
Returns available time slots for a specific workshop showing date, time, and remaining spots.

---

### 2. Workshop Slots API

#### List All Available Slots
```
GET /api/slots/
```
Lists all available time slots across workshops with filtering by workshop and date.

**Parameters:**
- `workshop` (optional): Filter by workshop ID
- `date` (optional): Filter by specific date (YYYY-MM-DD format)

#### Get Single Slot
```
GET /api/slots/{id}/
```
Retrieves details for a specific time slot including availability and capacity.

---

### 3. Workshop Registrations API

#### Create Registration
```
POST /api/registrations/
```
Creates a new workshop registration and automatically updates slot availability. Validates participant count against available spots.

**Request Body Parameters:**
- `workshop` (required): Workshop ID
- `slot` (required): Slot ID
- `full_name` (required): Participant full name
- `email` (required): Email address
- `phone` (required): Phone number
- `number_of_participants` (required): Number of participants
- `experience_level` (optional): beginner, intermediate, advanced
- `special_requests` (optional): Any special requirements

#### List Registrations
```
GET /api/registrations/
```
Lists all registrations with filtering by workshop and status.

**Parameters:**
- `workshop` (optional): Filter by workshop ID
- `status` (optional): Filter by status (pending, confirmed, cancelled, completed)

#### Get Single Registration
```
GET /api/registrations/{id}/
```
Retrieves detailed information for a specific registration.

#### Update Registration
```
PUT /api/registrations/{id}/
PATCH /api/registrations/{id}/
```
Updates registration details. Partial updates supported with PATCH.

#### Delete Registration
```
DELETE /api/registrations/{id}/
```
Cancels and removes a registration.

-----------------------------------------------------------------------------------------------

## Models

### Workshop Model
- `workshop_id`: Unique identifier (string)
- `name`: Workshop name
- `workshop_type`: Type (group, one-on-one, couple, birthday, party)
- `difficulty_level`: Difficulty (beginner, intermediate, advanced, all)
- `description`: Full description
- `short_description`: Brief description
- `duration_hours`: Duration in hours
- `price`: Price per participant
- `max_participants`: Maximum number of participants
- `min_age`: Minimum age requirement
- `image`: Workshop image (optional)
- `is_active`: Active status
- `available_slots`: Number of available slots
- `includes_materials`: Materials included
- `includes_refreshments`: Refreshments included
- `takes_home_creation`: Can take creation home
- `is_featured`: Featured workshop
- `is_popular`: Popular workshop

### WorkshopSlot Model
- `workshop`: Foreign key to Workshop
- `date`: Slot date
- `start_time`: Start time
- `end_time`: End time
- `available_spots`: Available spots
- `is_available`: Availability status

### WorkshopRegistration Model
- `workshop`: Foreign key to Workshop
- `slot`: Foreign key to WorkshopSlot (optional)
- `full_name`: Participant name
- `email`: Email address
- `phone`: Phone number
- `number_of_participants`: Number of participants
- `special_requests`: Special requests
- `experience_level`: Experience level
- `status`: Registration status (pending, confirmed, cancelled, completed)
- `total_amount`: Total amount (calculated automatically)

---

## Sample Data

Run the following command to load sample workshops:
```bash
python load_sample_workshops.py
```

This will create 7 sample workshops with slots for the next 4 weeks.

---

## Admin Interface

Access the Django admin at `/admin/` to manage:
- Workshops
- Workshop Slots
- Registrations

All models are registered with the admin interface with appropriate list displays, filters, and search capabilities.
