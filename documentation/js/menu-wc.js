'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">da-bubble documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-63ac8a7609d916008ec1d7fb70f6f11d25cec750425dab8c196f262d7c87e13ac3c9d90bf3121976ae9a893b523d212f6a86aa8060e03aee1eec0b6d14ccb633"' : 'data-bs-target="#xs-components-links-module-AppModule-63ac8a7609d916008ec1d7fb70f6f11d25cec750425dab8c196f262d7c87e13ac3c9d90bf3121976ae9a893b523d212f6a86aa8060e03aee1eec0b6d14ccb633"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-63ac8a7609d916008ec1d7fb70f6f11d25cec750425dab8c196f262d7c87e13ac3c9d90bf3121976ae9a893b523d212f6a86aa8060e03aee1eec0b6d14ccb633"' :
                                            'id="xs-components-links-module-AppModule-63ac8a7609d916008ec1d7fb70f6f11d25cec750425dab8c196f262d7c87e13ac3c9d90bf3121976ae9a893b523d212f6a86aa8060e03aee1eec0b6d14ccb633"' }>
                                            <li class="link">
                                                <a href="components/ActionHandlerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActionHandlerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddChannelDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddChannelDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddUserDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddUserDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddreactionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddreactionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AvatarChooseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AvatarChooseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChannelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DateLineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DateLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditChannelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditChannelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditChannelUsersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditChannelUsersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmptyWindowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmptyWindowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImprintComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImprintComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IntroComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IntroComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainscreenComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainscreenComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessageCreateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessageEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrivacyPolicyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrivacyPolicyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReactionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReactionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResetPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShowChannelUsersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShowChannelUsersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidenavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidenavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartscreenComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartscreenComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ThreadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThreadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToolbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserProfilComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserProfilComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-AppModule-63ac8a7609d916008ec1d7fb70f6f11d25cec750425dab8c196f262d7c87e13ac3c9d90bf3121976ae9a893b523d212f6a86aa8060e03aee1eec0b6d14ccb633"' : 'data-bs-target="#xs-directives-links-module-AppModule-63ac8a7609d916008ec1d7fb70f6f11d25cec750425dab8c196f262d7c87e13ac3c9d90bf3121976ae9a893b523d212f6a86aa8060e03aee1eec0b6d14ccb633"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-63ac8a7609d916008ec1d7fb70f6f11d25cec750425dab8c196f262d7c87e13ac3c9d90bf3121976ae9a893b523d212f6a86aa8060e03aee1eec0b6d14ccb633"' :
                                        'id="xs-directives-links-module-AppModule-63ac8a7609d916008ec1d7fb70f6f11d25cec750425dab8c196f262d7c87e13ac3c9d90bf3121976ae9a893b523d212f6a86aa8060e03aee1eec0b6d14ccb633"' }>
                                        <li class="link">
                                            <a href="directives/IfChangedDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IfChangedDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Answer.html" data-type="entity-link" >Answer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Channel.html" data-type="entity-link" >Channel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Chat.html" data-type="entity-link" >Chat</a>
                            </li>
                            <li class="link">
                                <a href="classes/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="classes/Reaction.html" data-type="entity-link" >Reaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/Thread.html" data-type="entity-link" >Thread</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ActiveSelectionService.html" data-type="entity-link" >ActiveSelectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthFirebaseService.html" data-type="entity-link" >AuthFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelFirebaseService.html" data-type="entity-link" >ChannelFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatFirebaseService.html" data-type="entity-link" >ChatFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormatService.html" data-type="entity-link" >FormatService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GenerateIdService.html" data-type="entity-link" >GenerateIdService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IfChangedService.html" data-type="entity-link" >IfChangedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageFirebaseService.html" data-type="entity-link" >MessageFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageFirebaseService.html" data-type="entity-link" >StorageFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThreadFirebaseService.html" data-type="entity-link" >ThreadFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserFirebaseService.html" data-type="entity-link" >UserFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserProfileService.html" data-type="entity-link" >UserProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserStatusFirebaseService.html" data-type="entity-link" >UserStatusFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WindowSizeService.html" data-type="entity-link" >WindowSizeService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});