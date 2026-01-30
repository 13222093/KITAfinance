import { Elysia, t } from 'elysia';
import { groupService } from '../services/group.service';
import { whatsappService } from '../services/whatsapp.service';

export const groupRouter = new Elysia({ prefix: '/group' })
  .post('/create', ({ body }: { body: { name: string; target_amount: number; max_members: number; admin: { id: string; name?: string; address: string; wa_phone?: string } } }) => {
    const group = groupService.createGroup({
      name: body.name,
      targetAmount: body.target_amount,
      maxMembers: body.max_members,
      admin: body.admin
    });
    return group;
  }, {
    body: t.Object({
      name: t.String(),
      target_amount: t.Numeric(),
      max_members: t.Number(),
      admin: t.Object({
        id: t.String(),
        name: t.Optional(t.String()),
        address: t.String(),
        wa_phone: t.Optional(t.String())
      })
    })
  })

  .post('/invite', ({ body }: { body: { group_id: string } }) => {
    return groupService.generateInviteLink(body.group_id);
  }, {
    body: t.Object({ group_id: t.String() })
  })

  .post('/join', ({ body }: { body: { group_id: string; member: { id: string; name?: string; address: string; wa_phone?: string } } }) => {
    const res = groupService.joinGroup({ groupId: body.group_id, member: body.member });
    return res;
  }, {
    body: t.Object({
      group_id: t.String(),
      member: t.Object({
        id: t.String(),
        name: t.Optional(t.String()),
        address: t.String(),
        wa_phone: t.Optional(t.String())
      })
    })
  })

  .post('/deposit', async ({ body }: { body: { group_id: string; member_id: string; amount_idrx: number; group_name?: string; member_name?: string } }) => {
    const res: any = groupService.deposit({ groupId: body.group_id, memberId: body.member_id, amount: body.amount_idrx });
    if (res && res.success) {
      // fire WA notification (stub)
      await whatsappService.notifyDeposit({ groupName: body.group_name ?? '', memberName: body.member_name ?? body.member_id, amount: body.amount_idrx, totalPool: 0, count: '' });
    }
    return res;
  }, {
    body: t.Object({
      group_id: t.String(),
      member_id: t.String(),
      amount_idrx: t.Numeric(),
      group_name: t.Optional(t.String()),
      member_name: t.Optional(t.String())
    })
  })

  .post('/propose', ({ body }: { body: { group_id: string; type: 'STRATEGY' | 'WITHDRAWAL'; title: string; details: string; created_by: string; voting_period_hours?: number } }) => {
    return groupService.propose({
      groupId: body.group_id,
      type: body.type,
      title: body.title,
      details: body.details,
      createdBy: body.created_by,
      votingPeriodHours: body.voting_period_hours
    });
  }, {
    body: t.Object({
      group_id: t.String(),
      type: t.Union([t.Literal('STRATEGY'), t.Literal('WITHDRAWAL')]),
      title: t.String(),
      details: t.String(),
      created_by: t.String(),
      voting_period_hours: t.Optional(t.Numeric())
    })
  })

  .post('/vote', ({ body }: { body: { group_id: string; proposal_id: string; member_id: string; choice: 'YES' | 'NO' } }) => {
    return groupService.vote({ groupId: body.group_id, proposalId: body.proposal_id, memberId: body.member_id, choice: body.choice });
  }, {
    body: t.Object({
      group_id: t.String(),
      proposal_id: t.String(),
      member_id: t.String(),
      choice: t.Union([t.Literal('YES'), t.Literal('NO')])
    })
  })

  .post('/execute', ({ body }: { body: { group_id: string; proposal_id: string } }) => {
    return groupService.executeIfApproved({ groupId: body.group_id, proposalId: body.proposal_id });
  }, {
    body: t.Object({
      group_id: t.String(),
      proposal_id: t.String()
    })
  })

  .get('/tracking/:group_id', ({ params }: { params: { group_id: string } }) => {
    return groupService.getTracking({ groupId: params.group_id });
  }, {
    params: t.Object({ group_id: t.String() })
  });
