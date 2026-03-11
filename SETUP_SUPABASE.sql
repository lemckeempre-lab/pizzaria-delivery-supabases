-- ================================================================
-- PIZZASAAS - Script SQL para o Supabase
-- Execute este script no SQL Editor do seu projeto Supabase
-- ================================================================

-- TABELA: lojas
CREATE TABLE IF NOT EXISTS lojas (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  nome        TEXT NOT NULL,
  dono        TEXT,
  tel         TEXT,
  email       TEXT,
  pix         TEXT,
  admin_pass  TEXT DEFAULT 'Pizza@Delivery2026!',
  tema        TEXT DEFAULT 'Brasa',
  logo        TEXT DEFAULT '🍕',
  tagline     TEXT DEFAULT 'Pizzas artesanais quentinhas na sua porta',
  ativa       BOOLEAN DEFAULT true,
  plano       TEXT DEFAULT 'Basico',
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: produtos
CREATE TABLE IF NOT EXISTS produtos (
  id          BIGSERIAL PRIMARY KEY,
  loja_slug   TEXT NOT NULL REFERENCES lojas(slug) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  descricao   TEXT,
  preco       NUMERIC(10,2) NOT NULL,
  cat         TEXT DEFAULT 'Pizzas',
  emoji       TEXT DEFAULT '🍕',
  badge       TEXT,
  ativo       BOOLEAN DEFAULT true,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id          BIGSERIAL PRIMARY KEY,
  loja_slug   TEXT NOT NULL REFERENCES lojas(slug) ON DELETE CASCADE,
  numero      TEXT NOT NULL,
  nome        TEXT,
  tel         TEXT,
  rua         TEXT,
  num_end     TEXT,
  bairro      TEXT,
  cidade      TEXT,
  comp        TEXT,
  pgto        TEXT,
  itens       JSONB,
  total       NUMERIC(10,2),
  status      TEXT DEFAULT 'Recebido',
  horario     TEXT,
  data_str    TEXT,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- RLS (Row Level Security) - acesso publico de leitura/escrita
-- A seguranca eh feita pelo login no frontend
-- ================================================================

ALTER TABLE lojas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos  ENABLE ROW LEVEL SECURITY;

-- Policies: permitir tudo para anon (autenticacao eh feita no app)
CREATE POLICY "allow_all_lojas"    ON lojas    FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_produtos" ON produtos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_pedidos"  ON pedidos  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ================================================================
-- PRONTO! Agora rode o seu site e cadastre a primeira pizzaria.
-- ================================================================
