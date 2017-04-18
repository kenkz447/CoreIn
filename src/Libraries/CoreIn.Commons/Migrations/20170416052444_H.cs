using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreIn.Commons.Migrations
{
    public partial class H : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Group",
                table: "CoreIn_TaxonomyTypeDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prefix",
                table: "CoreIn_TaxonomyTypeDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Suffix",
                table: "CoreIn_TaxonomyTypeDetail",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_TaxonomyType",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Group",
                table: "CoreIn_TaxonomyDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prefix",
                table: "CoreIn_TaxonomyDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Suffix",
                table: "CoreIn_TaxonomyDetail",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Taxonomy",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Group",
                table: "CoreIn_MenuDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prefix",
                table: "CoreIn_MenuDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Suffix",
                table: "CoreIn_MenuDetail",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Menu",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Group",
                table: "CoreIn_FileEntityDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prefix",
                table: "CoreIn_FileEntityDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Suffix",
                table: "CoreIn_FileEntityDetail",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_FileEntity",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Group",
                table: "CoreIn_EntityTypeDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prefix",
                table: "CoreIn_EntityTypeDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Suffix",
                table: "CoreIn_EntityTypeDetail",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_EntityType",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Group",
                table: "CoreIn_TaxonomyTypeDetail");

            migrationBuilder.DropColumn(
                name: "Prefix",
                table: "CoreIn_TaxonomyTypeDetail");

            migrationBuilder.DropColumn(
                name: "Suffix",
                table: "CoreIn_TaxonomyTypeDetail");

            migrationBuilder.DropColumn(
                name: "Group",
                table: "CoreIn_TaxonomyDetail");

            migrationBuilder.DropColumn(
                name: "Prefix",
                table: "CoreIn_TaxonomyDetail");

            migrationBuilder.DropColumn(
                name: "Suffix",
                table: "CoreIn_TaxonomyDetail");

            migrationBuilder.DropColumn(
                name: "Group",
                table: "CoreIn_MenuDetail");

            migrationBuilder.DropColumn(
                name: "Prefix",
                table: "CoreIn_MenuDetail");

            migrationBuilder.DropColumn(
                name: "Suffix",
                table: "CoreIn_MenuDetail");

            migrationBuilder.DropColumn(
                name: "Group",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropColumn(
                name: "Prefix",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropColumn(
                name: "Suffix",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropColumn(
                name: "Group",
                table: "CoreIn_EntityTypeDetail");

            migrationBuilder.DropColumn(
                name: "Prefix",
                table: "CoreIn_EntityTypeDetail");

            migrationBuilder.DropColumn(
                name: "Suffix",
                table: "CoreIn_EntityTypeDetail");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_TaxonomyType",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Taxonomy",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Menu",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_FileEntity",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_EntityType",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
