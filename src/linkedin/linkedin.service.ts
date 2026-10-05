import { Injectable } from '@nestjs/common';

@Injectable()
export class LinkedinService {
  private readonly clientId = process.env.LINKEDIN_CLIENT_ID!;
  private readonly clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
  private readonly redirectUri = process.env.LINKEDIN_REDIRECT_URI!;
  private readonly accessToken = "AQV7aOzjcILXdgW2jzktY3oCS6jx5OBlCaWKvIMEG9hv5dmfwjX6I8IJmbvr09P-wxNM-VBJR3y3NZreIEd_2XAKIwaAoYqxZ9I1u7XM3ZxvVqalldruZCFC8W_9vkEsCbh0L4dsQiCCVTOJsQwDNBYgTcdCNEh21UsOHfAO9xdo_o0Kh9tyKS6OqGyXg5IU6jPc1raha9Oiy5KqNlXasCOlWn2P4qopKq1d8kiL7twqO_B_8mou2ouTIMuaQXnvss7C88INnwDh1Damz6Svk5FDjoy9rSD6wm09sYC05NewM_4ipRC80kt7MBgVfEsokrofIFeLtneAQwrofKjvLbNQ0lJ4kA";

  getAuthorizationUrl() {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'openid profile w_member_social',
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  }

  async getAccessToken(code: string) {
    console.log({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });
    const response = await fetch(
      'https://www.linkedin.com/oauth/v2/accessToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

    async createPost(accessToken: string, text: string) {
    const response = await fetch(
        'https://api.linkedin.com/rest/posts',
        {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'LinkedIn-Version': '202601',
            'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
            author: 'urn:li:person:SEU_MEMBER_ID',
            commentary: text,
            visibility: 'PUBLIC',
            distribution: {
            feedDistribution: 'MAIN_FEED',
            targetEntities: [],
            thirdPartyDistributionChannels: [],
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false,
        }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }

    return data;
    }

    async getMemberProfile(accessToken: string) {

        const response = await fetch(
            'https://api.linkedin.com/v2/userinfo',
            {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
            },
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        return data;
        }

    async createPostTeste(author: string, text: string) {
        const response = await fetch(
            'https://api.linkedin.com/rest/posts',
            {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202601',
                'X-Restli-Protocol-Version': '2.0.0',
            },
            body: JSON.stringify({
                author: `urn:li:person:w6IfSMgskV`,
                commentary: 'teste',
                visibility: 'PUBLIC',
                distribution: {
                feedDistribution: 'MAIN_FEED',
                targetEntities: [],
                thirdPartyDistributionChannels: [],
                },
                lifecycleState: 'PUBLISHED',
                isReshareDisabledByAuthor: false,
            }),
            },
        );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}
}