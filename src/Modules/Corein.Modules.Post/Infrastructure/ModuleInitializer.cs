using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using CoreIn.Commons;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using CoreIn.EntityCore;

namespace CoreIn.Modules.Post
{
    public class ModularInitializer : IModuleInitializer
    {
        private void InitDatabase(UserManager<User> userManager, IMenuHelper menuHelper, EntityTypeManager entityTypeManager)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;
            var appMenu = menuHelper.Menu(AppKey.AppMenuName);

            menuHelper.CreateMenuEntity(
                new Menu {
                    Name = "posts",
                    Parent = appMenu,
                    Children = new List<Menu>
                    {            
                        menuHelper.CreateMenuEntity(
                            new Menu {
                                Name = "liblary",
                                Children = new List<Menu>
                                {
                                     menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "liblary-index",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "All blog", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Tất cả bài viết", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "post"},
                                            new MenuDetail { Field = "action", Value = "index"},
                                            new MenuDetail { Field = "url", Value = $"/post?entityTypeId={entityTypeManager.Liblary.Id}"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-bars\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    ),
                                    menuHelper.CreateMenuEntity(
                                        new Menu
                                        {
                                            Name = "liblary-new",
                                        },
                                        new MenuDetail[]
                                        {
                                            new MenuDetail { Field = "title", Value = "New post", Language="en-US"},
                                            new MenuDetail { Field = "title", Value = "Bài viết mới", Language="vi-VN"},
                                            new MenuDetail { Field = "controller", Value = "post"},
                                            new MenuDetail { Field = "action", Value = "create"},
                                            new MenuDetail { Field = "url", Value = $"/post/create?entityTypeId={entityTypeManager.Liblary.Id}"},
                                            new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"},
                                        },
                                        supperUser, false
                                    )
                                }
                            },
                            new MenuDetail[]
                            {
                                new MenuDetail { Field = "title", Value = "Liblay", Language="en-US"},
                                new MenuDetail { Field = "title", Value = "Thư viện", Language="vi-VN"},
                                new MenuDetail { Field = "url", Value = "#"},
                                new MenuDetail { Field = "icon", Value = "<i class=\"fa fa-sticky-note\" aria-hidden=\"true\"></i>"},
                            },
                            supperUser, false
                            )
                    }
                },
                new MenuDetail[]
                {
                    new MenuDetail { Field = "title", Value = "Posts"}
                }, supperUser
            );
        }

        public void Init(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();

            var userManager = serviceProvider.GetService<UserManager<User>>();
            var menuHelper = serviceProvider.GetService<IMenuHelper>();
            var taxonomyHelper = serviceProvider.GetService<ITaxonomyHelper>();

            var entityTypeManager = new EntityTypeManager(serviceProvider.GetService<IEntityTypeManager>(), userManager);
            var taxonomyTypeManager = new TaxonomyTypeManager(entityTypeManager, taxonomyHelper, userManager);

            services.AddSingleton(entityTypeManager);
            services.AddSingleton(taxonomyTypeManager);

            InitDatabase(userManager, menuHelper, entityTypeManager);
        }
    }
}
