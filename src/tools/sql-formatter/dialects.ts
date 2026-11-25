import type { SqlLanguage } from 'sql-formatter';

/** Dialects offered in the UI (type-only import: no formatter code is bundled with the page). */
export const SQL_DIALECTS: { value: SqlLanguage; label: string }[] = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'transactsql', label: 'SQL Server (T-SQL)' },
  { value: 'plsql', label: 'Oracle PL/SQL' },
  { value: 'bigquery', label: 'Google BigQuery' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'redshift', label: 'Amazon Redshift' },
  { value: 'spark', label: 'Spark SQL' },
  { value: 'duckdb', label: 'DuckDB' },
  { value: 'clickhouse', label: 'ClickHouse' },
  { value: 'trino', label: 'Trino / Presto' },
  { value: 'db2', label: 'IBM Db2' },
];

export type KeywordCase = 'upper' | 'lower' | 'preserve';
export type SqlIndent = '2' | '4' | 'tab';
