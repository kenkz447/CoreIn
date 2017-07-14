using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreIn.Commons.Migrations
{
    public partial class X : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_PostEntityDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_ProjectDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_PageDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_OptionGroupDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_DesignTemplateDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_ConstructionDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_CollectionDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_AlbumDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_TaxonomyTypeDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_TaxonomyDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_MenuDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_FileEntityDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TempId",
                table: "CoreIn_EntityTypeDetail",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_PostEntityDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_ProjectDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_PageDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_OptionGroupDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_DesignTemplateDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_ConstructionDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_CollectionDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_AlbumDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_TaxonomyTypeDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_TaxonomyDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_MenuDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropColumn(
                name: "TempId",
                table: "CoreIn_EntityTypeDetail");

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_PostEntityDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_ProjectDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_PageDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_OptionGroupDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_DesignTemplateDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_ConstructionDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_CollectionDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_AlbumDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_TaxonomyTypeDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_TaxonomyDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_MenuDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_FileEntityDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentIndex",
                table: "CoreIn_EntityTypeDetail",
                nullable: true);
        }
    }
}
