#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/db8e20423f6154d68299a60de361aeb02ce5d0d8223f48984c93fb4d00fb2309/contract';
import endContract from '../../snapshots/db8e20423f6154d68299a60de361aeb02ce5d0d8223f48984c93fb4d00fb2309/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'tenant_domains',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('domain', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isPrimary', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('isVerified', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('sslActive', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('tenantId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'tenants',
        columns: [
          col('activeModules', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('activeThemeId', 'text', {
            notNull: true,
            default: lit('default'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('customDomain', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('defaultLocale', 'text', {
            notNull: true,
            default: lit('es'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('planTier', 'text', {
            notNull: true,
            default: lit('starter'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('pending_setup'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('subdomain', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('supportedLocales', 'text[]', {
            notNull: true,
            default: lit(['es']),
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'tenants_activeModules_elem_not_null_cf0e3740',
            sql`array_position("activeModules", NULL) IS NULL`,
          ),
          checkExpression(
            'tenants_supportedLocales_elem_not_null_d9348cd9',
            sql`array_position("supportedLocales", NULL) IS NULL`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenant_domains',
        constraint: 'tenant_domains_domain_key',
        columns: ['domain'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenants',
        constraint: 'tenants_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenants',
        constraint: 'tenants_subdomain_key',
        columns: ['subdomain'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenants',
        constraint: 'tenants_customDomain_key',
        columns: ['customDomain'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenant_domains',
        index: 'tenant_domains_tenantId_idx_c93ed4f1',
        columns: ['tenantId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenant_domains',
        foreignKey: {
          name: 'tenant_domains_tenantId_fkey',
          columns: ['tenantId'],
          references: { schema: 'public', table: 'tenants', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
