using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreIn.Commons.Migrations
{
    public partial class D : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "EntityTypeId",
                table: "CoreIn_FileEntityDetail",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "CoreIn_EntityType",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "EntityTypeId",
                table: "CoreIn_EntityType",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "OwnerId",
                table: "CoreIn_EntityType",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ParentId",
                table: "CoreIn_EntityType",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityDetail_EntityTypeId",
                table: "CoreIn_FileEntityDetail",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_EntityType",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_EntityType_OwnerId",
                table: "CoreIn_EntityType",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_EntityType_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_EntityType",
                column: "EntityTypeId",
                principalTable: "CoreIn_EntityType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_EntityType_AspNetUsers_OwnerId",
                table: "CoreIn_EntityType",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_FileEntityDetail_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_FileEntityDetail",
                column: "EntityTypeId",
                principalTable: "CoreIn_EntityType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_EntityType_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_EntityType");

            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_EntityType_AspNetUsers_OwnerId",
                table: "CoreIn_EntityType");

            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_FileEntityDetail_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_FileEntityDetail_EntityTypeId",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_EntityType");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_EntityType_OwnerId",
                table: "CoreIn_EntityType");

            migrationBuilder.DropColumn(
                name: "EntityTypeId",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "CoreIn_EntityType");

            migrationBuilder.DropColumn(
                name: "EntityTypeId",
                table: "CoreIn_EntityType");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "CoreIn_EntityType");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "CoreIn_EntityType");
        }
    }
}
