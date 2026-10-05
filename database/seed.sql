INSERT INTO users (id, username, name, password_hash)
VALUES 
    (1, 'ana', 'Ana Silva', '$2b$10$3OM98.GxTvex31nFiPprv.qjkww6F.4xDX9.j2VyypPHHzjRjjnsO'),
    (2, 'carlos', 'Carlos Souza', '$2b$10$3OM98.GxTvex31nFiPprv.qjkww6F.4xDX9.j2VyypPHHzjRjjnsO')
ON CONFLICT (username) DO NOTHING;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

INSERT INTO requests (title, description, category, status, requester_id)
VALUES 
    ('Acesso ao VPN', 'Solicito acesso ao VPN corporativo', 'TI', 'OPEN', 2),
    ('Novo monitor', 'Monitor atual está com defeito', 'INFRAESTRUTURA', 'IN_PROGRESS', 2),
    ('Licença do pacote Office', 'Necessito renovar a licença', 'COMPRAS', 'DONE', 2),
    ('Cadeira ergonômica', 'Solicitação de nova cadeira ergonômica', 'RH', 'OPEN', 2)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 5..20 LOOP
        INSERT INTO requests (title, description, category, status, requester_id)
        VALUES (
            'Solicitação de TI #' || i, 
            'Descrição detalhada para a solicitação de TI número ' || i,
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
