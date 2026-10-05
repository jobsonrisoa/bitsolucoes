DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..1000 LOOP
        INSERT INTO requests (title, description, category, status, requester_id)
        VALUES (
            'Load Test Request #' || i, 
            'This is a generated request for load testing purposes. Sequence ID: ' || i,
            'TI',
            CASE (i % 3)
                WHEN 0 THEN 'OPEN'::"RequestStatus"
                WHEN 1 THEN 'IN_PROGRESS'::"RequestStatus"
                ELSE 'DONE'::"RequestStatus"
            END,
            2
        ) ON CONFLICT DO NOTHING;
    END LOOP;
END $$;
