import { NewOrganizationForm } from '@/services/types';
import { Length, IsEmail, IsIn } from 'class-validator';

export class NewOrganizationFormClass {
    @Length(0, 256)
    name: string;

    @IsEmail()
    @Length(0, 256)
    contactEmail: string;

    @IsIn(["starter", "pro", "enterprise"])
    pricingTier: string;

    @Length(0, 1024)
    additionalNotes: string;

    public constructor (form: NewOrganizationForm) {
        this.name = form.name;
        this.contactEmail = form.contactEmail;
        this.pricingTier = form.pricingTier;
        this.additionalNotes = form.additionalNotes;
    }
}
