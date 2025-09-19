import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthService } from './core/guards/auth.service';

const uri = 'http://localhost:8080/graphql';

export function createApollo(httpLink: HttpLink, authService: AuthService): ApolloClientOptions<any> {


  const authLink = setContext((operation, context) => {
    const token = authService.getToken();
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError && (networkError as any).status === 401) {
      authService.logout();
    }
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => console.error(`GraphQL Error: ${message}`));
    }
  });

  const http = httpLink.create({ uri });
  const link = authLink.concat(errorLink).concat(http);

  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, AuthService],
    },
  ],
})
export class GraphQLModule {}
