using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreIn.Commons.Migrations
{
    public partial class V : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_PostEntityDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_ProjectDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_PageDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_OptionGroupDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_DesignTemplateDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_ConstructionDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_CollectionDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_AlbumDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_TaxonomyTypeDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_TaxonomyDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_MenuDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_FileEntityDetail",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_EntityTypeDetail",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_PostEntityDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_ProjectDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_PageDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_OptionGroupDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_DesignTemplateDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_ConstructionDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_CollectionDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_AlbumDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_TaxonomyTypeDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_TaxonomyDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_MenuDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropColumn(
                name: "ParentIndex",
                table: "CoreIn_EntityTypeDetail");
        }
    }
}
