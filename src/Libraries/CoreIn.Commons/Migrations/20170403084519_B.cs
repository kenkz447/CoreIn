using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class B : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoreIn_FileEntity",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: true),
                    FileEntityId = table.Column<long>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    OwnerId = table.Column<long>(nullable: true),
                    ParentId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_FileEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntity_CoreIn_FileEntity_FileEntityId",
                        column: x => x.FileEntityId,
                        principalTable: "CoreIn_FileEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntity_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_FileEntityDetail",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(nullable: false),
                    Field = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: true),
                    ModifiedById = table.Column<long>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_FileEntityDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntityDetail_CoreIn_FileEntity_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_FileEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntityDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntity_FileEntityId",
                table: "CoreIn_FileEntity",
                column: "FileEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntity_OwnerId",
                table: "CoreIn_FileEntity",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityDetail_EntityId",
                table: "CoreIn_FileEntityDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityDetail_ModifiedById",
                table: "CoreIn_FileEntityDetail",
                column: "ModifiedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_FileEntityDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_FileEntity");
        }
    }
}
